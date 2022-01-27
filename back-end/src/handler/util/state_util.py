from ..protos import san11_platform_pb2 as pb


def on_approve(curr: pb.ResourceState, dest: pb.ResourceState) -> bool:
    return curr == pb.ResourceState.UNDER_REVIEW and dest == pb.ResourceState.NORMAL
